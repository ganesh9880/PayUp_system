# WhatsApp Message Troubleshooting Guide

## 🚨 **Messages Not Sending - Quick Fixes**

### **Step 1: Join Twilio WhatsApp Sandbox**

**This is the most common issue!** You need to join the Twilio WhatsApp Sandbox first:

1. **Send this message** to `+14155238886` on WhatsApp:
   ```
   join <your-sandbox-code>
   ```

2. **Get your sandbox code** from your Twilio Console:
   - Go to https://console.twilio.com/
   - Navigate to Messaging → Try it out → Send a WhatsApp message
   - You'll see your sandbox code there

3. **After joining**, you can receive messages from the sandbox

### **Step 2: Test Twilio Connection**

Visit this URL in your browser to test if Twilio works:
```
http://localhost:5000/api/groups/test-twilio
```

**Expected Response:**
- ✅ Success: `{"message": "Twilio test successful!", "sid": "...", "status": "..."}`
- ❌ Error: Check the error message for details

### **Step 3: Check Phone Number Format**

Make sure phone numbers are in the correct format:
- **Correct**: `+918919601688` (with country code)
- **Wrong**: `8919601688` (without country code)
- **Wrong**: `+91 8919601688` (with spaces)

### **Step 4: Common Error Messages & Solutions**

| Error | Solution |
|-------|----------|
| `Error 21211: Invalid 'To' Phone Number` | Check phone number format |
| `Error 21214: 'To' phone number not verified` | Join WhatsApp sandbox |
| `Error 21215: Account not authorized for 'From' phone number` | Check Twilio account status |
| `Error 21608: The 'From' phone number is not a valid WhatsApp number` | Use sandbox number |
| `Error 21610: The 'To' phone number is not a valid WhatsApp number` | Check number format |

### **Step 5: Verify Your Setup**

1. **Check Twilio Account Status**:
   - Go to https://console.twilio.com/
   - Verify account is active and has credits

2. **Check WhatsApp Sandbox Status**:
   - In Twilio Console, go to Messaging → Try it out
   - Verify you can send test messages

3. **Test with Your Own Number**:
   - Add yourself to a group
   - Create an expense where you owe money
   - Try sending reminders

### **Step 6: Debug Steps**

1. **Check Console Logs**:
   - Open browser console (F12)
   - Look for detailed error messages
   - Check backend terminal for Twilio errors

2. **Test Calculation**:
   ```
   http://localhost:5000/api/groups/[GROUP_ID]/test-calculation
   ```

3. **Check Balance Calculation**:
   - Make sure someone actually owes money
   - Verify the calculation logic is working

### **Step 7: Alternative Solutions**

If WhatsApp still doesn't work:

1. **Use SMS instead** (requires different Twilio setup)
2. **Use email notifications** (simpler to implement)
3. **Use in-app notifications** (no external dependencies)

### **Step 8: Quick Test Scenario**

1. **Create a test group** with your phone number
2. **Add an expense**:
   - Amount: ₹1000
   - Paid by: You
   - Participants: You + another member
3. **Check balances** - other member should owe ₹500
4. **Send reminders** - should work if sandbox is joined

### **Need Help?**

If you're still having issues:
1. Check the console logs for specific error messages
2. Try the test endpoint: `/api/groups/test-twilio`
3. Verify your Twilio account has credits
4. Make sure you've joined the WhatsApp sandbox

## 🎯 **Most Common Fix**

**90% of the time, the issue is that you haven't joined the Twilio WhatsApp Sandbox.**

Send `join <your-sandbox-code>` to `+14155238886` on WhatsApp, and it should work! 