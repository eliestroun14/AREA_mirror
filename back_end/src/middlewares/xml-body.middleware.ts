import { Injectable, NestMiddleware } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { Request, Response, NextFunction } from 'express';
import { XMLParser } from 'fast-xml-parser';

type XMLRequestBody = string | Record<string, unknown> | undefined;

interface XMLRequest extends Request<never, any, XMLRequestBody> {
  xmlParseError?: Error;
}

const bodyParserXML = bodyParser.text({
  type: 'application/xml',
});

@Injectable()
export class XMLBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const xmlRequest = req as XMLRequest;

    bodyParserXML(req, res, () => {
      const raw = xmlRequest.body;
      if (typeof raw === 'string' && raw.trim()) {
        try {
          const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '',
          });

          xmlRequest.body = parser.parse(raw) as Record<string, unknown>;
        } catch (err) {
          xmlRequest.xmlParseError =
            err instanceof Error ? err : new Error(String(err));
        }
      }
      next();
    });
  }
}
