import string
import secrets


def generate_password(length):
    characters = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(secrets.choice(characters) for _ in range(length))
    return password


print("================================")
print("      PASSWORD GENERATOR")
print("================================")

while True:
    try:
        length = int(input("Enter password length: "))

        if length < 4:
            print("Password length must be at least 4.")
        else:
            password = generate_password(length)
            print("\nGenerated Password:", password)
            break

    except ValueError:
        print("Please enter a valid number.")