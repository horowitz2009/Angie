/**
 * LokiJS JquerySyncAdapter
 * @author Joe Minichino <joe.minichino@gmail.com>
 *
 * A remote sync adapter example for LokiJS
 */

var jquerySyncAdapter = (function() {
//////start////

    function JquerySyncAdapterError() {}

    JquerySyncAdapterError.prototype = new Error;
    
    /**
     * this adapter assumes an object options is passed,
     * containing the following properties:
     * ajaxLib: jquery or compatible ajax library
     * save: { url: the url to save to, dataType [optional]: json|xml|etc., type [optional]: POST|GET|PUT}
     * load: { url: the url to load from, dataType [optional]: json|xml| etc., type [optional]: POST|GET|PUT }
     */

    function jquerySyncAdapter(options) {
      this.options = options;
		if (!options) {
		  throw new JquerySyncAdapterError('No options configured in JquerySyncAdapter');
		}

		if (!options.ajaxLib) {
		  throw new JquerySyncAdapterError('No ajax library specified in JquerySyncAdapter');
		}
    }

    jquerySyncAdapter.prototype.saveDatabase = function (name, data, callback) {

	
	
	this.options.ajaxLib.ajax
    ({
        type: "POST",
        dataType : 'json',
        
        url: 'assets/save_json.php',
        data: { data: data },
        success: callback,
        failure: function() {alert("Error!");}
    });
	
	
	
	/////////  this.options.ajaxLib.post("assets/save_json.php", data, callback);
	
/*	
      this.options.ajaxLib.ajax({
        type: this.options.save.type || 'POST',
        url: this.options.save.url,
        data: data,
        success: callback,
        failure: function () {
          throw new JquerySyncAdapterError("Remote sync failed");
        },
        dataType: this.options.save.dataType || 'json'
      });
	  
*/	  
    };

    jquerySyncAdapter.prototype.loadDatabase = function (name, callback) {
      //this.options.ajaxLib.get(name, callback);
      
      
      this.options.ajaxLib.ajax({
        type: 'GET',
        url: name,
        success: callback,
        failure: function () {
          throw new JquerySyncAdapterError("Remote sync failed");
        },
        dataType: 'text'
      });

      
      //OR
      
      /*
      this.options.ajaxLib.get(name, function(data, success){
        if (typeof (data) === 'string') {
          callback(data);
        } else {
          callback(JSON.stringify(data));
        }
      });*/
      
    };

    return jquerySyncAdapter;

  






//////end//////
}());

