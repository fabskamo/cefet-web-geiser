// importação de dependência(s)
import express from 'express'
import hbs from 'hbs'
import fs from 'fs'


// variáveis globais deste módulo
const PORT = 3000
const db = {}

const app = express()
// carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
// você pode colocar o conteúdo dos arquivos json no objeto "db" logo abaixo
// dica: 1-4 linhas de código (você deve usar o módulo de filesystem (fs))
db.jogadores = JSON.parse(fs.readFileSync('server/data/jogadores.json'))
db.jogosPorJogadores = JSON.parse(fs.readFileSync('server/data/jogosPorJogador.json'))



// configurar qual templating engine usar. Sugestão: hbs (handlebars)
//app.set('view engine', '???qual-templating-engine???');
//app.set('views', '???caminho-ate-pasta???');
// dica: 2 linhas
app.set('view engine', 'hbs')
app.set('views', 'server/views')


// EXERCÍCIO 2
// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
// dica: o handler desta função é bem simples - basta passar para o template
//       os dados do arquivo data/jogadores.json (~3 linhas)
app.get('/', (req, res) => {
    res.render('index', db.jogadores)
  })
  

// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter ~15 linhas de código
app.get('/jogador/:id', (req, res) => {
    const playerdId = req.params.id
  
    const player = db.jogadores.players.find(({ steamid }) => steamid === playerdId)
    const games = db.jogosPorJogadores[playerdId]
  
    games.games.sort((a, b) => b.playtime_forever - a.playtime_forever)
  
    const calculated = {
      nonPlayed: games.games.filter(({ playtime_forever }) => playtime_forever === 0).length,
      favoriteGame: { ...games.games[0], playtime_forever: parseInt(games.games[0].playtime_forever / 60) },
      mostPlayedGames: games.games.slice(0, 5).map(game => ({ ...game, playtime_forever: parseInt(game.playtime_forever / 60) }))
    }
  
    console.log(calculated)
  
    res.render('jogador', { player, game_count: games.game_count, calculated })
  })

// EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
// dica: 1 linha de código
app.use (express.static('client/'))

// abrir servidor na porta 3000 (constante PORT)
// dica: 1-3 linhas de código
app.listen(PORT, () => {
    console.log('App listening on port 3000')
  })