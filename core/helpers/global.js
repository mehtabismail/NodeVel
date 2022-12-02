
// Global functions
global.__resolved_classes = []

global.view = function(response)
{
    if(response === undefined) response = null
    return resolve('core.render.view', response)
}

global.resolve = function(file, ...deps)
{
    file = file.replace(/\./g,'/'); //('.', '/');
    // console.log('../' + file + '.js')
    var instance = require('../../' + file + '.js');
    // console.log('instance: ', instance)
    if(deps !== undefined && deps.length > 0)
    {
        //console.log('resolve().new {' + file + '}')
        return new instance(...deps);
    }
    //console.log('resolve().new {' + file + '}')
    return new instance();
}

global.resolveOnce = function(file, ...deps)
{
    let resolved_instance = null
    file = file.replace(/\./g,'/'); //('.', '/');
    // console.log('../' + file + '.js')
    var instance = require('../../' + file + '.js');

    for(let i in __resolved_classes) {
        if(i == file) {
            resolved_instance = __resolved_classes[i]
        }
    }

    if(resolved_instance === null)
    {
        if(deps !== undefined && deps.length > 0)
        {
            resolved_instance = new instance(...deps)
        }else{
            resolved_instance = new instance()
        }
        __resolved_classes[file] = resolved_instance
        //console.log('resolveOnce().new {' + file + '}')
        return resolved_instance
    }
    //console.log('resolveOnce().reuse {' + file + '}')
    return resolved_instance
}

global.use = function(file)
{
    file = file.replace(/\./g,'/'); //('.', '/');
    return require('../../' + file + '.js');
}

global.getEnv = function(name, default_value)
{
    if(default_value === undefined) {
        default_value = ''
    }
    return process.env[name] !== undefined ? process.env[name] : default_value;
}