import ast
import os
from typing import Set, Dict

class CodeSlicer(ast.NodeVisitor):
    def __init__(self):
        self.called_functions: Set[str] = set()

    def visit_Call(self, node):
        if isinstance(node.func, ast.Name):
            self.called_functions.add(node.func.id)
        elif isinstance(node.func, ast.Attribute):
            self.called_functions.add(node.func.attr)
        self.generic_visit(node)


def extract_functions_from_file(file_path):
    with open(file_path, "r") as f:
        tree = ast.parse(f.read())

    functions = {}
    for node in tree.body:
        if isinstance(node, ast.FunctionDef):
            functions[node.name] = ast.get_source_segment(open(file_path).read(), node)

    return functions, tree


def slice_code(entry_file):
    functions, tree = extract_functions_from_file(entry_file)

    slicer = CodeSlicer()
    slicer.visit(tree)

    used_functions = slicer.called_functions

    sliced_code = {}
    for name in used_functions:
        if name in functions:
            sliced_code[name] = functions[name]

    return sliced_code
sliced = slice_code("evaluate.py")

for fn, code in sliced.items():
    print(f"\n--- FUNCTION: {fn} ---\n")
    print(code)

def find_function_definition(root_dir, func_name):
    for root, _, files in os.walk(root_dir):
        for file in files:
            if file.endswith(".py"):
                path = os.path.join(root, file)
                functions, _ = extract_functions_from_file(path)
                if func_name in functions:
                    return path, functions[func_name]
    return None, None
--- FILE: evaluate.py ---
<entry function>

--- FILE: metrics/specificity.py ---
<specificity function>

--- FILE: metrics/robustness.py ---
<robustness function>



You are an expert in machine learning evaluation and statistics.

You are given Python code that was used to compute the evaluation results below.

IMPORTANT RULES:
- The code shown is the complete and exact logic used for evaluation.
- Do NOT assume any additional functions, preprocessing, or safeguards.
- Do NOT infer intent beyond what is explicitly implemented.
- Reason strictly from the code.

--- BEGIN CODE ---

<PASTE EXTRACTED CODE HERE>

--- END CODE ---

The following JSON contains evaluation results produced by executing the above code:

--- BEGIN RESULTS ---

<PASTE JSON HERE>

--- END RESULTS ---

Task:
<EXACT QUESTION>



