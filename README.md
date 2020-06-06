# Агрегатор кинотеатров (диплом)


## **Быстрый доступ**

  1. [Технологический стек](#технологический-стек)
  1. [FAQ](#faq)
  1. [Запуск и сборка](#запуск-и-сборка)


## **Технологический стек**

  1. Typescript (в процессе внедрения)
  1. React.js
  1. NodeJS
  1. SCSS
  1. [Ant Design](https://ant.design/)
  1. [Scraper API](https://www.scraperapi.com/)


## **FAQ**

### Идея
> Проживая в Врн в студенческие годы очень любил ходить по кинотеатрам, и открывать каждый раз несколько сайтов в браузере было не очень удобной затеей, чтобы найти наиболее подходящий, что по времени, что по деньгам киносеанс.
### Качество кода
> Код уже не так плох, как был, всё ещё в процессе рефакторинга, но не настолько больно смотреть теперь (не знаю, зачм так сложно было писать).
### Typescript
> Решил внедрить уже сейчас для удобства разработки, пока что в процессе и можно встретить `any`
### Почему не настроил CORS? (косяк с запуском на своей машине без расширения)
> Нехватка времени, да и нулевые познания в бэкенде сказались таким образом. Т.к. развитие в T-shaped person является преимуществом, разберусь и поправлю в обозримом будущем :)
### Масштабируемо ли решение? 
> На самом деле сомневаюсь, присутствуют довольно большие затраты на переписывание регулярок, хотя, когда нпишешь под 4 кинотеатра - уже всё кажется лёгким
### Развитие?
> Была идея так же парсить залы, цены, но времени не хватило.
### Фичи
> - рекомендательная система на основе просматриваемого в данный момент расписания фильма и его списка жанров. У нас даже нет косяка с выводом в рекомендованных того же фильма, что и мы просматриваем (замечал, гуляя по конкурентам) 
> - наверянка есть ещё, но нужно углубиться и вспомнить
### Почему просто не спарсить Яндекс.Афишу?
> Насколько помню там есть алгоритм переодического изменения структуры DOM, не знаю, насколько это сейчас актуально. Поэтому не показалась данная затея целесообразной.


## **Запуск и сборка**
#### Для запуска приложения открываем два терминала, в первом директория server, во втором - client
> - Так же необходимо расширение в браузере для CORS: что-нибудь включающее **Access-Control-Allow-Origin: \*** (да, это косяк)
> - И подсунуть в localStorage в поле `_user: 1`

##### Для старта сервера 
```
yarn install / npm i
yarn start / npm start
```
##### Для старта клиента 
```
yarn install / npm i
yarn dev / npm run dev
```
Далее проект сам откроется в выбранном по умолчанию браузере.