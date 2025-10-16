# WebDoyoula

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/shwuff/webdoyoula)](https://github.com/shwuff/webdoyoula)
[![Release](https://img.shields.io/github/v/release/shwuff/webdoyoula)](https://github.com/shwuff/webdoyoula/releases)

**WebDoyoula** — это Telegram WebApp для генерации и просмотра AI-изображений, взаимодействия с постами, подписками, лайками и оплатами через интерфейс Telegram. Репозиторий содержит фронтенд для WebApp и вспомогательные скрипты для интеграции с Telegram. :contentReference[oaicite:1]{index=1}

---

## Краткое описание проекта

Doyoula — генеративная нейрофотосеть, превращающая обычные фотографии в профессиональные портреты и стильные аватары. Сервис прост в использовании: загрузите изображение, выберите стиль — нейросеть создаст результат. WebDoyoula предоставляет интерфейс прямо внутри Telegram (WebApp), чтобы пользователям было удобно генерировать и просматривать изображения. :contentReference[oaicite:2]{index=2}

---

## Возможности

- Генерация изображений/аватаров на базе загруженных фото
- Просмотр ленты постов с AI-картинками
- Взаимодействие: лайки, комментарии (если реализовано)
- Подписки и платные функции через Telegram-платежи
- Интеграция с Telegram WebApp API (встраивание в чат/бота)

---

## Быстрый старт (локально)

> Предполагается, что в репозитории уже есть `package.json` и стандартная структура (`public/`, `src/`). Если у вас другой стек — подкорректируйте команды.

1. Клонируйте репозиторий:
```bash
git clone https://github.com/shwuff/webdoyoula.git
cd webdoyoula
