import { config } from '../config/Constants';
import { Request, Response } from 'express';
import shortId from 'shortid';
import { URLModel } from '../config/model/URL';

export class URLController {
    public async shorten(req: Request, response: Response): Promise<void> {
        const { originURL } = req.body;
        const url = URLModel.findOne({ originURL });
        if (url) {
            response.json(url);
            return
        }
        const hash = shortId.generate();
        const shortURL = `${config.API_URL}/${hash}`;
        const newURL = URLModel.create({ hash, shortURL, originURL });
        response.json(newURL);
    }

    public async redirect(req: Request, response: Response): Promise<void> {
        const { hash } = req.params;
        const url = await URLModel.findone({ hash });
        
        if(url) {
            response.redirect(url.originURL);
            return;
        }
        
        response.status(400).json({ error: 'URL not found' });
    }
}