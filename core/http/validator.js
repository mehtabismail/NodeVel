module.exports = class validator {

    constructor(res) {
        this.res = res
        this.errors = []
    }

    /**
     * @method validate
     * @param data jsonObject
     * @returns {array} errors
     */
    validate(data, schema, extra_is_allowed) {
        let me = this
        let errors = []
        if (extra_is_allowed === undefined) extra_is_allowed = true
        let found = null
        schema.forEach(s => {
            let pushed = false
            found = null
            for (let key in data) {
                if (s.name == key) found = data[key]
            }
            if (!s.required && found == null && s.default !== undefined) data[s.name] = s.default
            if (s.required && found == null) {
                errors.push('Field {' + s.name + '} is required.')
                pushed = true
            }
            if (s.required && s.type == "string" && found == '') {
                errors.push('Field {' + s.name + '} is required.')
                pushed = true
            }
            if (found && s.type == 'array') {
                if (found instanceof Array) { } else {
                    errors.push('Field {' + s.name + '} should be of type ' + s.type)
                    pushed = true
                }
            }
            if (found && s.enum !== undefined && s.type == 'enum') {
                if (s.enum instanceof Array) {
                    if (!s.enum.includes(found)) {
                        errors.push('Field {' + s.name + '} should have value from one of following {' + s.enum.toString() + '}')
                        pushed = true
                    }
                }
            }
            if (found && s.enum !== undefined && s.type == 'array') {
                if (s.enum instanceof Array) {
                    found.forEach(f => {
                        if (!s.enum.includes(f)) {
                            errors.push('Field {' + s.name + '} should have value from one of following {' + s.enum.toString() + '}')
                            pushed = true
                        }
                    })
                }
            }
            if (found && s.type != 'any' && s.type != 'array' && s.type != 'enum' && typeof found !== s.type) {
                errors.push('Field {' + s.name + '} should be of type ' + s.type)
                pushed = true
            }
            if (found && s.regex !== undefined) {
                if (!s.regex.test(String(found))) {
                    // console.log("REGEX: " + '{' + s.name + '}' + " Applying " + s.regex + ' on ' + String(found) + ' resulted = ', s.regex.test(String(found)))
                    errors.push('Field {' + s.name + '} has invalid data.')
                    pushed = true
                }
            }
            if (!s.required && !found) pushed = true
            if (s.skip !== undefined && s.skip) delete data[s.name]

            // children
            if (s['children'] !== undefined && s.children instanceof Array && !pushed && found) {
                errors = errors.concat(me.validateChildren(s, s.name, found, s.children, extra_is_allowed))
            }
        })
        if (!extra_is_allowed) {
            let extra_keys = ''
            for (let key in data) {
                found = false
                schema.forEach(s => {
                    if (s.name == key) found = true
                })
                if (found == false) extra_keys += (extra_keys == '' ? key : ', ' + key)
            }
            if (extra_keys != '') errors.push('Following fields does not match with database schema: ' + extra_keys)
        }
        return errors
    }

    validateChildren(obj, name, data, schema, extra_is_allowed) {
        if(!data) return []
        let me = this
        let errors = []
        if (extra_is_allowed === undefined) extra_is_allowed = true
        let found = null
        if (obj.type == 'array') {
            data.forEach(new_data => {
                schema.forEach(s => {
                    if (s.required === undefined) s.required = false
                    found = null
                    for (let key in new_data) {
                        if (s.name == key) found = new_data[key]
                    }
                    if (!s.required && found == null && s.default !== undefined) new_data[s.name] = s.default
                    if (s.required && found == null) errors.push('Field {' + name + '.' + s.name + '} is required.')
                    if (s.required && s.type == "string" && found == '') errors.push('Field {' + name + '.' + s.name + '} is required.')
                    if (found && s.type == 'array') {
                        if (found instanceof Array) { } else {
                            errors.push('Field {' + name + '.' + s.name + '} should be of type ' + s.type)
                        }
                    }
                    if (found && s.enum !== undefined && s.type == 'enum') {
                        if (s.enum instanceof Array) {
                            if (!s.enum.includes(found)) {
                                errors.push('Field {' + name + '.' + s.name + '} should have value from one of following {' + s.enum.toString() + '}')
                            }
                        }
                    }
                    if (found && s.enum !== undefined && s.type == 'array') {
                        if (s.enum instanceof Array) {
                            found.forEach(f => {
                                if (!s.enum.includes(f)) {
                                    errors.push('Field {' + name + '.' + s.name + '} should have value from one of following {' + s.enum.toString() + '}')
                                }
                            })
                        }
                    }
                    if (found && s.type != 'any' && s.type != 'array' && s.type != 'enum' && typeof found !== s.type) errors.push('Field {' + name + '.' + s.name + '} should be of type ' + s.type)
                    if (found && s.regex !== undefined) {
                        if (!s.regex.test(String(found))) {
                            // console.log("REGEX: " + '{' + name + '.' + s.name + '}' + " Applying " + s.regex + ' on ' + String(found) + ' resulted = ', s.regex.test(String(found)))
                            errors.push('Field {' + name + '.' + s.name + '} has invalid data {' + String(found) + '}.')
                        }
                    }
                    if (s.skip !== undefined && s.skip) delete new_data[s.name]

                    // children
                    if (s['children'] !== undefined && s.children instanceof Array && found) {
                        errors = errors.concat(me.validateChildren(s, name + '.' + s.name, found, s.children, extra_is_allowed))
                    }
                })
                if (!extra_is_allowed) {
                    let extra_keys = ''
                    for (let key in new_data) {
                        found = false
                        schema.forEach(s => {
                            if (s.name == key) found = true
                        })
                        if (found == false) extra_keys += (extra_keys == '' ? name + '.' + key : ', ' + name + '.' + key)
                    }
                    if (extra_keys != '') errors.push('Following fields does not match with database schema: ' + extra_keys)
                }
            })
        } else {
            schema.forEach(s => {
                if (s.required === undefined) s.required = false
                found = null
                for (let key in data) {
                    if (s.name == key) found = data[key]
                }
                if (!s.required && found == null && s.default !== undefined) data[s.name] = s.default
                if (s.required && found == null) errors.push('Field {' + name + '.' + s.name + '} is required.')
                if (s.required && s.type == "string" && found == '') errors.push('Field {' + name + '.' + s.name + '} is required.')
                if (found && s.type == 'array') {
                    if (found instanceof Array) { } else {
                        errors.push('Field {' + name + '.' + s.name + '} should be of type ' + s.type)
                    }
                }
                if (found && s.type != 'any' && s.type != 'array' && typeof found !== s.type) errors.push('Field {' + name + '.' + s.name + '} should be of type ' + s.type)
                if (found && s.regex !== undefined) {
                    if (!s.regex.test(String(found))) {
                        // console.log("REGEX: " + '{' + name + '.' + s.name + '}' + " Applying " + s.regex + ' on ' + String(found) + ' resulted = ', s.regex.test(String(found)))
                        errors.push('Field {' + name + '.' + s.name + '} has invalid data.')
                    }
                }
                if (s.skip !== undefined && s.skip) delete data[s.name]

                // children
                if (s['children'] !== undefined && s.children instanceof Array) {
                    errors = errors.concat(me.validateChildren(s, name + '.' + s.name, found, s.children, extra_is_allowed))
                }
            })
            if (!extra_is_allowed) {
                let extra_keys = ''
                for (let key in data) {
                    found = false
                    schema.forEach(s => {
                        if (s.name == key) found = true
                    })
                    if (found == false) extra_keys += (extra_keys == '' ? name + '.' + key : ', ' + name + '.' + key)
                }
                if (extra_keys != '') errors.push('Following fields does not match with database schema: ' + extra_keys)
            }
        }
        return errors
    }

}