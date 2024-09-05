from cryptography.fernet import Fernet


# Generate a key and keep it safe, you'll need this to decrypt the data.
key = Fernet.generate_key()
print(key)

