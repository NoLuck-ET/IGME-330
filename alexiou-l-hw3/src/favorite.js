class Favorite{
    constructor(fid, text, url, comments){
        this._fid = fid;
        //this._fid = crypto.randomUUID();
        //console.log(this.fid);
        this._text = text;
        this._url = url;
        this._comments = comments;
    }
}

export{Favorite};