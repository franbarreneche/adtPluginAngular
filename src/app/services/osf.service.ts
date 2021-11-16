import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OsfService {
  message: any;

  constructor() {
    fromEvent(window, 'message').subscribe((event: any) => {
      this.getPostMessageData(event);
    });
    this.sendOkMessage();
  }

  //MYSFUTFF
  pluginOpen(data: any) {
    this.message = data;
    console.log(data);
  }

  close() {
    alert("cerrando plugin");
  }

  save() {
    alert("Cerrando y guardando datos");
  }


  //STUFF REQUIRED TO GET THE MESSAGE FROM OFS
  debugMode: boolean = true;

  sendOkMessage() {
    let messsageData = {
      apiVersion: 1,
      method: 'ready'
    };

    this.sendPostMessageData(messsageData);
  }

  sendPostMessageData(data: any) {
    if (document.referrer !== '') {
      this.log(window.location.host + ' -> ' + data.method + ' ' + this.getDomain(document.referrer), JSON.stringify(data, null, 4));

      parent.postMessage(JSON.stringify(data), this.getOrigin(document.referrer));
    }
  }

  getPostMessageData(event: any) {
    if (typeof event.data !== 'undefined') {
      if (this.isJson(event.data)) {
        var data = JSON.parse(event.data);

        if (data.method) {
          this.log(window.location.host + ' <- ' + data.method + ' ' + this.getDomain(event.origin), JSON.stringify(data, null, 4));

          switch (data.method) {
            case 'open':
              this.pluginOpen(data);

              break;
            case 'error':
              data.errors = data.errors || { error: 'Unknown error' };
              this.showError(data.errors);

              break;
            default:
              alert('Unknown method');

              break;
          }
        }
        else {
          this.log(window.location.host + ' <- NO METHOD ' + this.getDomain(event.origin), null, null, true);
        }
      }
      else {
        this.log(window.location.host + ' <- NOT JSON ' + this.getDomain(event.origin), null, null, true);
      }
    }
    else {
      this.log(window.location.host + ' <- NO DATA ' + this.getDomain(event.origin), null, null, true);
    }
  }

  isJson(str: string) {
    try {
      JSON.parse(str);
    }
    catch (e) {
      return false;
    }
    return true;
  }

  getOrigin(url: any) {
    if (url != '') {
      if (url.indexOf("://") > -1) {
        return 'https://' + url.split('/')[2];
      }
      else {
        return 'https://' + url.split('/')[0];
      }
    }

    return '';
  }

  getDomain(url: any) {
    if (url != '') {
      if (url.indexOf("://") > -1) {
        return url.split('/')[2];
      }
      else {
        return url.split('/')[0];
      }
    }

    return '';
  }

  showError(errorData: any) {
    alert(JSON.stringify(errorData, null, 4));
  }

  log(title: any, data: any, color?: any, warning?: any) {
    if (!this.debugMode) {
      return;
    }
    if (!color) {
      color = '#0066FF';
    }
    if (!!data) {
      console.groupCollapsed('%c[Plugin API] ' + title, 'color: ' + color + '; ' + (!!warning ? 'font-weight: bold;' : 'font-weight: normal;'));
      console.log('[Plugin API] ' + data);
      console.groupEnd();
    }
    else {
      console.log('%c[Plugin API] ' + title, 'color: ' + color + '; ' + (!!warning ? 'font-weight: bold;' : ''));
    }
  }
}
