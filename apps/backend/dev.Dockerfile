FROM elixir:1.15-alpine

RUN apk add --no-cache build-base git nodejs npm

WORKDIR /app

COPY mix.exs mix.lock ./
RUN mix local.hex --force && \
    mix local.rebar --force && \
    mix deps.get

COPY . .

EXPOSE 4000

CMD ["mix", "phx.server"]