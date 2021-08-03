import moment from 'moment';
import 'moment/locale/ru';

moment().local('ru');

export default class CreateWidget {
    constructor(url) {
        this.url = url;
        this.init();
    }

    init() {
        this.drawWidget();
        this.createEventSourse();
    }

    drawWidget() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('widget-wrapper');
        this.wrapper.innerHTML = `  <div class="widget">
                                        <div class="widget-news-block">
                                            <ul class="news-list">
                                            </ul>
                                        </div>
                                    </div>`;
        document.body.appendChild(this.wrapper);

        this.listNews = this.wrapper.querySelector('.news-list')
    }

    drawAllNews(data) {
        this.listNews.textContent = '';
        for(let i of data) {
            this.drawEvent(i);
        }
    }

    drawEvent(data) {
        console.log(data);
        const li = document.createElement('li');
        li.classList.add('news-item');
        if (data.type === 'goal') {
            li.classList.add('goal');
        } else if (data.type === 'freekick') {
            li.classList.add('freekick');
        }

        li.innerHTML = `<div class="block-content">
                            <div class="new-block date-block">
                            </div>
                            <div class="new-block message-block">
                            </div>
                        </div>`;
        this.listNews.appendChild(li);
        const dateBlock = li.querySelector('.date-block');
        dateBlock.textContent = moment(data.date).format('HH:mm DD:MM:YYYY');
        const messageBlock = li.querySelector('.message-block');
        messageBlock.textContent = data.message;
        console.log(this.listNews)
        this.listNews.scrollTop = this.listNews.scrollHeight;
        
    }

    createEventSourse() {
        console.log(this.url);
        const eventSourse = new EventSource(`${this.url}/sse`);
            eventSourse.addEventListener('message', (event) => {
            const item = JSON.parse(event.data);
            console.log(item);
            if (item.status === 'init') {
                this.drawAllNews(item.data);
                return;
            }

            this.drawEvent(item);
          });
            eventSourse.addEventListener('open', (event) => {
            console.log(event);
        });
            eventSourse.addEventListener('error', (event) => {
            console.log(event); 
        });
    }
}