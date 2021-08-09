'use strict';

const { Compiler, Stats } = require('webpack');

const collect = require('collect.js');
const fs = require('fs');
const md5 = require('md5');
const os = require('os');
const path = require('path');
const validate = require('schema-utils').validate;

const schema = {
    'type': 'object',
    'properties': {
        'public': {
            'type': 'string',
        },
        'name': {
            'type': 'string',
        },
        'include': {
            'type': 'array',
            'items': {
                'type': 'string',
            },
            'minItems': 0,
        },
        'require': {
            'type': 'array',
            'items': {
                'type': 'string',
            },
            'minItems': 0,
        },
    },
    'additionalProperties': false,
    'required': [
        'public',
        'name',
    ],
};

interface OptionsInterface
{
    public : string;
    name : string;
    include? : Array<string>;
    require? : Array<string>;
}

class LaravelMixManifestPlugin {
    private public : string;
    private name : string;
    private include : Array<string>;
    private require : Array<string>;

    constructor(options : OptionsInterface)
    {
        validate(schema, options, {
            name: this.constructor.name,
            baseDataPath: 'options',
        });

        this.public = options.public;
        this.name = options.name;
        this.include = options.include ?? [];
        this.require = options.require ?? [];
    }

    apply(compiler : typeof Compiler) : void
    {
        compiler.hooks.done.tap(this.constructor.name, (stats : typeof Stats) : void => {
            const outputPath = stats.toJson().outputPath;
            const manifestPath = path.resolve(this.public, this.name);

            const files = collect(stats.toJson().assetsByChunkName)
                .flatten()
                .map((file : string) => path.resolve(outputPath, file)) // resolve full output path
                .merge(this.include.filter(function (path : string) : boolean {
                    return fs.existsSync(path);
                }))
                .merge(this.require)
                .keyBy((file : string) => path.resolve(outputPath, file).substr(this.public.length)) // key by public path
                .map((file : string) => file + '?v=' + md5(fs.readFileSync(file, 'utf8'))) // append hash
                .map((file : string) => file.substr(this.public.length)); // convert to public path

            const manifest = JSON.stringify(files.all(), null, 4) + os.EOL;

            fs.mkdirSync(path.dirname(manifestPath), {
                recursive: true,
            })

            fs.writeFileSync(manifestPath, manifest);
        });
    }
}

module.exports = LaravelMixManifestPlugin;
module.exports.default = LaravelMixManifestPlugin;
