const Inventory  = require('../models/Inventory');
const sendEmail  = require('./sendEmail');

const checkAndAlertLowStock = async (ingredientsUsed) => {
  try {
    const lowItems = [];

    for (const { name, category } of ingredientsUsed) {
      const item = await Inventory.findOne({ name, category });

      if (item && item.quantity <= item.threshold) {
        lowItems.push(item); 
      }
    }

    if (lowItems.length === 0) return;

    const itemLines = lowItems
      .map(i => `🔴 ${i.name} (${i.category}) — ${i.quantity} remaining (threshold: ${i.threshold})`)
      .join('\n');

    await sendEmail({
      to:      process.env.EMAIL_USER,  
      subject: '⚠️ Low Stock Alert — Pizza App',
      text:    `The following ingredients are running low after a recent order:\n\n${itemLines}\n\nPlease restock soon.`
    });

    console.log(`Low stock alert sent for: ${lowItems.map(i => i.name).join(', ')}`);

  } catch (err) {
    console.log('Stock alert error (ignored):', err.message);
  }
};

module.exports = checkAndAlertLowStock;
