# Settlement Process Guide

## 🔄 **How "Pending" Turns into "Settled"**

### **Step-by-Step Process:**

#### **1. Create Group with UPI ID**
- Group creator provides their UPI ID when creating the group
- This UPI ID will be used for all payments in the group

#### **2. Add Expenses**
- When an expense is added, **automatic settlements are created**
- Each participant (except the person who paid) gets a settlement record
- Settlements start as **"Pending"** status

#### **3. Receive Payments**
- When someone pays via UPI to the group's UPI ID
- **Group creator** marks the corresponding settlement as "Settled"
- This updates the settlement status and records who marked it

#### **4. Track Progress**
- View settlement summary to see pending vs settled amounts
- Send WhatsApp reminders to those with pending settlements

## 🎯 **How to Mark Settlements as "Settled"**

### **Method 1: Using the UI**
1. **Go to the group details page**
2. **Find the expense** with pending settlements
3. **Click "Mark Settled"** button next to the settlement
4. **Confirm** the payment was received
5. **Status changes** from "Pending" to "Settled"

### **Method 2: Using the API**
```bash
PUT /api/groups/{groupId}/expenses/{expenseId}/settlements/{settlementId}
{
  "settled": true
}
```

## 📊 **Settlement Summary**

The group details page shows:
- **Total Settlements**: Total number of settlements
- **Pending**: Number of unsettled payments
- **Settled**: Number of completed payments
- **Pending Amount**: Total amount still owed

## 🔍 **Example Scenario**

### **Group Setup:**
- **Group**: "Trip to Goa"
- **Creator**: John (UPI: john.doe@okicici)
- **Members**: John, Alice, Bob, Carol

### **Expense Added:**
- **Description**: Hotel booking
- **Amount**: ₹4000
- **Paid by**: John
- **Participants**: All 4 members

### **Automatic Settlements Created:**
- Alice owes ₹1000 (Pending)
- Bob owes ₹1000 (Pending)
- Carol owes ₹1000 (Pending)
- John gets ₹3000 back (no settlement needed)

### **Payment Process:**
1. **Alice pays** ₹1000 to john.doe@okicici
2. **John marks** Alice's settlement as "Settled"
3. **Bob pays** ₹1000 to john.doe@okicici
4. **John marks** Bob's settlement as "Settled"
5. **Carol pays** ₹1000 to john.doe@okicici
6. **John marks** Carol's settlement as "Settled"

### **Final Status:**
- All settlements marked as "Settled"
- John has received all payments
- Group expenses are fully settled

## 🚀 **Benefits of This System**

1. **Clear Tracking**: Know exactly who has paid and who hasn't
2. **UPI Integration**: Use the group creator's UPI ID for all payments
3. **WhatsApp Reminders**: Send reminders with the correct UPI ID
4. **Settlement History**: Track when and who marked settlements
5. **Visual Feedback**: Easy to see pending vs settled status

## 💡 **Tips for Group Creators**

1. **Keep your UPI ID handy** when creating groups
2. **Mark settlements promptly** when payments are received
3. **Use WhatsApp reminders** for pending payments
4. **Check settlement summary** regularly
5. **Communicate clearly** about payment expectations

## 🔧 **Technical Details**

- **Settlements are created automatically** when expenses are added
- **Only participants who didn't pay** get settlement records
- **Settlement status is tracked** with timestamps
- **Who marked the settlement** is recorded
- **Real-time updates** when status changes 