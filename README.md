# IDOR-example



## Curls request to show vulnerability:

-- Unsafe route that should allow dowload:
```
curl -X POST http://localhost:3000/unsafe-download -H "Content-Type: application/json" -H "token: token-alice" -d '{"fileId": 1}'
```

--Unsafe route that shouln't allow download but it does:
```
curl -X POST http://localhost:3000/unsafe-download -H "Content-Type: application/json" -H "token: token-alice" -d '{"fileId": 2}'
```

## Curls request to show fix:
-- Safe route that should allow dowload:
```
curl -X POST http://localhost:3000/safe-download -H "Content-Type: application/json" -H "token: token-alice" -d '{"fileId": 1}'
```

--Safe route that blocks invalid request:
```
curl -X POST http://localhost:3000/safe-download -H "Content-Type: application/json" -H "token: token-alice" -d '{"fileId": 2}'
```