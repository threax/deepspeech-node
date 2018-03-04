import * as http from 'http';
import * as uuidv1 from 'uuid/v1';

export class ResponseManager {
    private responses: { [key: string]: http.ServerResponse } = {};

    public addResponse(response: http.ServerResponse): string {
        var name = uuidv1();
        while (this.responses[name] !== undefined) {
            name = uuidv1();
        }

        this.responses[name] = response;
        return name;
    }

    public getResponse(name: string) {
        var response = this.responses[name];
        if (response) {
            delete this.responses[name];
        }
        return response;
    }
}