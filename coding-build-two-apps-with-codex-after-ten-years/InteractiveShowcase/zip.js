/* Small, dependency-free ZIP reader/writer for the public TABIframe file format. */
(() => {
  'use strict';
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const table = Array.from({length:256},(_,n)=>{let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0;});
  function crc32(bytes){let c=0xffffffff;for(const b of bytes)c=table[(c^b)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
  function concat(parts){const bytes=new Uint8Array(parts.reduce((n,p)=>n+p.length,0));let i=0;for(const p of parts){bytes.set(p,i);i+=p.length;}return bytes;}
  function makeZip(files){
    const locals=[],central=[];let offset=0;
    for(const [name,content] of Object.entries(files)){
      const path=encoder.encode(name),data=typeof content==='string'?encoder.encode(content):new Uint8Array(content);
      const crc=crc32(data),h=new Uint8Array(30),v=new DataView(h.buffer);
      v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x800,true);v.setUint32(14,crc,true);v.setUint32(18,data.length,true);v.setUint32(22,data.length,true);v.setUint16(26,path.length,true);
      locals.push(h,path,data);
      const ch=new Uint8Array(46),cv=new DataView(ch.buffer);
      cv.setUint32(0,0x02014b50,true);cv.setUint16(4,20,true);cv.setUint16(6,20,true);cv.setUint16(8,0x800,true);cv.setUint32(16,crc,true);cv.setUint32(20,data.length,true);cv.setUint32(24,data.length,true);cv.setUint16(28,path.length,true);cv.setUint32(42,offset,true);
      central.push(ch,path);offset+=h.length+path.length+data.length;
    }
    const directory=concat(central),end=new Uint8Array(22),ev=new DataView(end.buffer),count=Object.keys(files).length;
    ev.setUint32(0,0x06054b50,true);ev.setUint16(8,count,true);ev.setUint16(10,count,true);ev.setUint32(12,directory.length,true);ev.setUint32(16,offset,true);
    return concat([...locals,directory,end]);
  }
  async function readZip(buffer){
    const bytes=new Uint8Array(buffer),view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
    if(bytes.length>30*1024*1024)throw new Error('展示版支援 30 MB 以內的旅程檔。');
    let end=-1;
    for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--)if(view.getUint32(i,true)===0x06054b50){end=i;break;}
    if(end<0)throw new Error('這不是有效的 ZIP／.tabiframe 檔案。');
    const count=view.getUint16(end+10,true);if(count>300)throw new Error('展示版最多支援 300 個套件項目。');
    let cursor=view.getUint32(end+16,true),total=0;const result={};
    for(let i=0;i<count;i++){
      if(cursor+46>bytes.length||view.getUint32(cursor,true)!==0x02014b50)throw new Error('套件目錄損毀。');
      const flag=view.getUint16(cursor+8,true),method=view.getUint16(cursor+10,true),crc=view.getUint32(cursor+16,true),size=view.getUint32(cursor+20,true),expanded=view.getUint32(cursor+24,true),nl=view.getUint16(cursor+28,true),el=view.getUint16(cursor+30,true),cl=view.getUint16(cursor+32,true),offset=view.getUint32(cursor+42,true);
      const name=decoder.decode(bytes.subarray(cursor+46,cursor+46+nl));cursor+=46+nl+el+cl;
      if(name.endsWith('/'))continue;
      if(name.startsWith('/')||name.includes('\\')||name.split('/').some(x=>x==='..'||x==='.')||Object.hasOwn(result,name)||name==='__proto__')throw new Error('套件包含不安全或重複的檔案路徑。');
      total+=expanded;if(expanded>20*1024*1024||total>50*1024*1024)throw new Error('套件解壓後超過展示版上限。');
      if(flag&1)throw new Error('展示版不支援加密 ZIP。');
      if(offset+30>bytes.length||view.getUint32(offset,true)!==0x04034b50)throw new Error('套件檔案損毀。');
      const start=offset+30+view.getUint16(offset+26,true)+view.getUint16(offset+28,true);
      if(start+size>bytes.length)throw new Error('套件檔案不完整。');
      let data=bytes.slice(start,start+size);
      if(method===8){
        if(typeof DecompressionStream==='undefined')throw new Error('請使用較新版瀏覽器匯入壓縮套件，或選擇 trip.json。');
        let stream;try{stream=new DecompressionStream('deflate-raw');}catch{throw new Error('瀏覽器不支援這個壓縮格式，請改用 trip.json。');}
        const reader=new Blob([data]).stream().pipeThrough(stream).getReader(),parts=[];let length=0;
        while(true){const part=await reader.read();if(part.done)break;length+=part.value.length;if(length>expanded||length>20*1024*1024){await reader.cancel();throw new Error('解壓資料超出宣告大小。');}parts.push(part.value);}data=concat(parts);
      }else if(method!==0)throw new Error('不支援的 ZIP 壓縮方式。');
      if(data.length!==expanded||crc32(data)!==crc)throw new Error('檔案完整性驗證失敗。');
      result[name]=data;
    }
    return result;
  }
  window.TripZip={makeZip,readZip,crc32};
})();
