FROM elixir:1.15-alpine

RUN apk add --no-cache build-base git nodejs npm

WORKDIR /app

RUN mix local.hex --force && \
    mix local.rebar --force

COPY . .

EXPOSE 4000

CMD ["sh", "-c", "mix deps.get && mix phx.server"]