PROMPT_TEMPLATE = """
You are a senior Python engineer reviewing validation logic.

Your task is to reason about the behavior and correctness of the validation
based strictly on the code and the provided input parameters.

Do NOT assume behavior that is not explicitly defined in the code.

--------------------------------
CODE UNDER ANALYSIS
--------------------------------

{code}

--------------------------------
VALIDATION INVOCATION
--------------------------------

The validate method is invoked with the following parameters:

{params}

--------------------------------
ANALYSIS TASKS
--------------------------------

1. Explain step-by-step how the validate method processes the input parameters.
2. State whether validation should PASS or FAIL, and why.
3. Identify any edge cases or missing validations revealed by this input.
4. If the behavior is ambiguous or incorrect, explain what change would be needed.

Respond concisely but with clear technical reasoning.
""".strip()

