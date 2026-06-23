class RequirementAnalyzer:

    def extract_requirements(
        self,
        content
    ):

        requirements = []

        lines = content.splitlines()

        for line in lines:

            line = line.strip()

            if len(line) > 10:

                requirements.append(
                    line[:200]
                )

        return requirements[:25]