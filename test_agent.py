import json
import requests
import time

API_URL = "http://localhost:3001/api/agent/chat"

print("--- 🚀 STARTING REDOTPAY AI-AUDIT AGENT TEST ---")
print("Scenario 1: User asks about their last purchase.")

def chat(msg):
    try:
        r = requests.post(API_URL, json={"message": msg})
        if r.status_code == 200:
            return r.json()
        else:
            return f"Error: {r.status_code}"
    except Exception as e:
        return f"Failed to connect: {e}"

# Test 1: Query transaction
print(f"User: 'Why was my last order declined?'")
response = chat("Why was my last order declined?")
print(f"Agent: {response.get('text')}")
print(f"Action: {response.get('action')}")
print("-" * 10)

# Test 2: Block card
print(f"User: 'I lost my card, help!'")
response = chat("I lost my card, help!")
print(f"Agent: {response.get('text')}")
print(f"Action: {response.get('action')}")
print("-" * 10)

# Test 3: Balance
print(f"User: 'Show my balance'")
response = chat("Show my balance")
print(f"Agent: {response.get('text')}")
print(f"Action: {response.get('action')}")
print("-" * 10)

print("--- DONE ---")
