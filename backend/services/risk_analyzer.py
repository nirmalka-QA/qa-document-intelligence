class RiskAnalyzer:

    def analyze(
        self,
        content
    ):

        risks = []

        text = content.lower()

        if "login" in text:
            risks.append(
                "Authentication Risk"
            )

        if "payment" in text:
            risks.append(
                "Payment Risk"
            )

        if "password" in text:
            risks.append(
                "Security Risk"
            )

        return risks