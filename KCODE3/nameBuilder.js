var utilNameBuilder = {
    getName: function (role) {
        if (Memory.nameIndex === undefined)
            Memory.nameIndex = {};
        if ((Memory.nameIndex[role] === undefined) || (Memory.nameIndex[role] > 995))
            Memory.nameIndex[role] = 0;
        return role + (Memory.nameIndex[role]);
    },
    commitName: function (role) {
        var newIndex = Memory.nameIndex[role] + 1;
        Memory.nameIndex[role] = newIndex;
    }
};
module.exports = utilNameBuilder;