const transpose = (result, row) => {
    row.forEach((item, i) => {
        if (!result[i]) result[i] = [];
        result[i].push(item)
    })
    return result;
}

module.exports.transpose = transpose;