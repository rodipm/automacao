const useModel = (args) => {
    if (!args)
        args = [];

    return new Promise((resolve, reject) => {
        const pythonModel = spawn('python', ['../MachineLearning/model.py', ...args]);
        pythonModel.stdout.on('data', (data) => {
            resolve(data.toString());
        })
    });
}

module.exports = { useModel }