class GapAnalyzer:

    def analyze(
        self,
        content
    ):

        gaps = []

        text = content.lower()

        if "error" not in text:
            gaps.append(
                "Missing Error Handling"
            )

        if "validation" not in text:
            gaps.append(
                "Missing Validation Rules"
            )

        return gaps