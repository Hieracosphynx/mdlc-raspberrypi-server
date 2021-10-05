class Memory {
    constructor(data) {
        this.memStatus = {
          memTotal: data[0],
          memFree: data[1],
          buffers: data[3],
          cached: data[4]
        }
        this.SIZE = 1024; // This is used for converting Kilobytes to Mega, to GB, etc.
        this.GIGA = "GIGA"
        this.MEGA = "MEGA"
      }

      convertValue({value, type}){
        switch(type){
            case "GIGA":
                const megaToGiga = value/this.SIZE;    
                return {
                    type,
                    value: megaToGiga
                }
            case "MEGA":
                return {
                    type,
                    value
                }
            default: 
                return {
                    type: "UNK",
                    value
                }
        }
      }

      checkIfKiloIsGiga(value) {
        // Initially the value is in KB
        const valueToMega = value/this.SIZE;
        if(valueToMega >= this.SIZE){
            return this.convertValue({
                value: valueToMega,
                type: this.GIGA
            });
        } 
        else {
            return this.convertValue({
                value: valueToMega,
                type: this.MEGA
            })
        }
      }

      getNonCachedBufferMemory(memTotalUsed){
        const { buffers, cached } = this.memStatus;
        this.nonCachedBufferMemory = memTotalUsed - (buffers + cached);
        
        return this.checkIfKiloIsGiga(this.nonCachedBufferMemory);
      }

      getTotalUsedMemory() {
        const { memTotal, memFree } = this.memStatus;
        this.memTotalUsed = memTotal - memFree;
        return this.getNonCachedBufferMemory(this.memTotalUsed);
      }
}

module.exports = Memory;