// GET paginated transactions
app.get('/api/transactions', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const transactions = await Transaction.find()
            .sort({ createdAt: 'desc' })
            .skip(skip)
            .limit(limit);
        res.json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
