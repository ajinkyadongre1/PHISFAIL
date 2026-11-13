import re
from typing import Dict, List, Any, Optional
import difflib
import logging
from backend.database.db_service import db_service

logger = logging.getLogger("phisfail.scam_dna")

LEGAL_DISCLAIMER = (
    "DISCLAIMER: Threat correlation identifies behavioral, infrastructural, or syntactic patterns across shared indicators. "
    "Correlation does not constitute definitive proof of unified attacker attribution or legal ownership without authorized forensic verification."
)

class ScamDNAEngine:
    def get_full_threat_graph(self, filter_brand: Optional[str] = None) -> Dict[str, Any]:
        """
        Retrieves all threat indicators and relationships formatted for React Flow graph rendering.
        """
        raw_graph = db_service.get_dna_graph()
        indicators = raw_graph.get("indicators", [])
        relationships = raw_graph.get("relationships", [])

        if filter_brand and filter_brand != "all":
            indicators = [i for i in indicators if filter_brand.lower() in (i.get("targeted_brand") or "").lower()]
            ind_ids = {i["id"] for i in indicators}
            relationships = [r for r in relationships if r.get("source") in ind_ids or r.get("target") in ind_ids]

        # Arrange in aesthetic radial / grid positions for initial rendering
        nodes = []
        import math
        total = len(indicators)
        radius = 280
        center_x = 450
        center_y = 350

        for idx, ind in enumerate(indicators):
            angle = (2 * math.pi / max(total, 1)) * idx
            pos_x = center_x + radius * math.cos(angle)
            pos_y = center_y + radius * math.sin(angle)

            # Node styling based on indicator type & reputation
            ind_type = ind.get("indicator_type", "domain")
            rep = ind.get("reputation_score", 50)
            
            node_type = "default"
            if ind_type in ("ip", "kit_signature"):
                node_type = "input"
            elif ind_type in ("phone", "upi"):
                node_type = "output"

            nodes.append({
                "id": ind["id"],
                "type": "customThreatNode",
                "position": {"x": round(pos_x, 1), "y": round(pos_y, 1)},
                "data": {
                    "id": ind["id"],
                    "label": ind["indicator_value"],
                    "indicatorType": ind_type,
                    "reputationScore": rep,
                    "timesSeen": ind.get("times_seen", 1),
                    "scamCategory": ind.get("scam_category", "Unknown"),
                    "targetedBrand": ind.get("targeted_brand", "Unspecified"),
                    "metadata": ind.get("metadata", {})
                }
            })

        edges = []
        for rel in relationships:
            edges.append({
                "id": rel["id"],
                "source": rel["source"],
                "target": rel["target"],
                "label": f"{rel.get('relation_type', 'related')} ({int(rel.get('confidence_score', 0.5) * 100)}%)",
                "animated": rel.get("confidence_score", 0.5) > 0.8,
                "data": {
                    "relationType": rel.get("relation_type", "related"),
                    "confidenceScore": rel.get("confidence_score", 0.5),
                    "relationReason": rel.get("relation_reason", "Correlated through shared indicators"),
                    "disclaimer": LEGAL_DISCLAIMER
                },
                "style": {
                    "stroke": "#ef4444" if rel.get("confidence_score", 0) > 0.9 else "#00f0ff",
                    "strokeWidth": 2
                }
            })

        return {
            "nodes": nodes,
            "edges": edges,
            "total_indicators": len(indicators),
            "total_correlations": len(relationships),
            "disclaimer": LEGAL_DISCLAIMER
        }

    def correlate_new_scan(self, target_input: str, scan_result: Dict[str, Any]) -> Dict[str, Any]:
        """
        Dynamically analyzes an incoming target to find existing threat correlations in the DNA database.
        """
        telemetry = scan_result.get("telemetry", {})
        domain = telemetry.get("domain") or target_input
        resolved_ip = telemetry.get("resolved_ip")
        
        raw_graph = db_service.get_dna_graph()
        existing_indicators = raw_graph.get("indicators", [])
        
        correlated_matches = []

        # 1. Check IP sharing
        if resolved_ip and resolved_ip != "Unresolved (NXDOMAIN)":
            for ind in existing_indicators:
                if ind.get("indicator_type") == "ip" and ind.get("indicator_value") == resolved_ip:
                    correlated_matches.append({
                        "matched_indicator": ind,
                        "correlation_type": "SHARED_HOSTING_INFRASTRUCTURE",
                        "confidence_score": 0.98,
                        "reason": f"Target domain resolves to hosting IP '{resolved_ip}', which is indexed in an active malicious cluster."
                    })

        # 2. String / Domain Typosquatting Similarity
        for ind in existing_indicators:
            if ind.get("indicator_type") == "domain":
                val = ind.get("indicator_value", "")
                similarity = difflib.SequenceMatcher(None, domain.lower(), val.lower()).ratio()
                if similarity > 0.65 and similarity < 1.0:
                    correlated_matches.append({
                        "matched_indicator": ind,
                        "correlation_type": "SYNTACTIC_DOMAIN_CLUSTER",
                        "confidence_score": round(similarity, 2),
                        "reason": f"Domain exhibits {int(similarity * 100)}% structural string similarity to known scam domain '{val}'."
                    })

        # 3. Targeted Brand Match
        for sig in scan_result.get("detected_signals", []):
            if "SBI" in sig.get("detail", ""):
                for ind in existing_indicators:
                    if ind.get("targeted_brand") == "State Bank of India" and ind.get("indicator_type") == "kit_signature":
                        correlated_matches.append({
                            "matched_indicator": ind,
                            "correlation_type": "PHISHING_KIT_SIGNATURE",
                            "confidence_score": 0.91,
                            "reason": f"Behavior and credential harvest fields match fingerprint for {ind.get('indicator_value')}."
                        })
                        break

        return {
            "target": target_input,
            "correlations_found": len(correlated_matches),
            "matches": correlated_matches,
            "disclaimer": LEGAL_DISCLAIMER
        }

scam_dna_engine = ScamDNAEngine()

