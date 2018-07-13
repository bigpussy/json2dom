var json2dom = {
    "transform":function(data, transform){
        return json2html._transform(data, transform);
    },
    "_transform": function(data, transform, key){
        var out = '';

        if(typeof key != 'undefined'){
            if(key.indexOf('^') > -1){
                out += '<' + key.substr(1, key.indexOf('^') - 1);
            }else
                out += '<' + key.substr(1);
        }

        var html = '';

        // if has data node, change the data root 
        if(typeof transform['@data'] === 'string'){
            var valueKey = transform['@data'].substr(1);
            data = data[valueKey];
        }
        // var fieldSize = Object.keys(transform).length;
        Object.keys(transform).forEach(function(x, index){
            if(typeof x === 'string'){ // single node
                if(x === '@data') return; // if @data appear , do nothing cause we have process it alreay
                if(x[0] === '#'){
                    html += json2html._transform(data, transform[x], x);
                }else if(x[0] === '$'){ // loop node
                    if(json2html._isArray(data)){
                        data.forEach(function(item){
                            html += json2html._transform(item, transform[x], x);
                        });
                    }
                }else{
                    var item = transform[x];
                    var value = '';
                    if(item[0] === '@'){
                        var valueKey = item.substr(1);
                        value = data[valueKey];
                    }else{
                        value = item;
                    }
                    if(x === 'html'){
                        html += value;
                    }else{
                        out += (' ' + x + '="' + value + '"');
                    }
                }
            }
        });

        if(typeof key != 'undefined'){
            out += '>';
            out += html;
            if(key.indexOf('^') > -1){
                out += '</' + key.substr(1, key.indexOf('^') - 1) + '>';
            }else{
                out += '</' + key.substr(1) + '>';
            }
        }else{ // the object is the root object
            out = html;
        }
        return out;
    },
    //isArray (fix for IE prior to 9)
	'_isArray':function(obj) {
		return Object.prototype.toString.call(obj) === '[object Array]';
	},
}
