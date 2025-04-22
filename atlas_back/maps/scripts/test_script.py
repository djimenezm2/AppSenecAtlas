import sys

if len(sys.argv) < 2:
    print("Usage: python test_script.py [arg1] [arg2] ... [argN]")
else:
    arguments = sys.argv[1:]
    arguments_text = "\n".join(arguments)
    try:
        with open("out.txt", "w") as file:
            file.write(arguments_text)
    except IOError as e:
        print(f"Error: {e}")
