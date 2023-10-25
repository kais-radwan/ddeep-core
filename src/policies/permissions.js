
process.PERMISSIONS = {};

let Permissions = {

    new: (id) => {
        process.PERMISSIONS[id] = {};
    },

    add: (id, channel, result) => {
        let permissions = process.PERMISSIONS[id] || {};
        permissions[channel] = result;
        process.PERMISSIONS = permissions;
    },

    get: (id, channel) => {
        let permissions = process.PERMISSIONS[id] || {};
        let scoped_permission = permissions[channel];
        if (scoped_permission) {
            return scoped_permission;
        } else {
            return undefined;
        }
    },

    delete: (id) => {
        delete process.PERMISSIONS[id];
    }

}

export default Permissions;