# Kaamelott, Best Punchline

The website for test https://kaamelott.xyz

## Database

I use mysql and sequelize to manage my database.

### API Quotes

End Points :
```
https://kaamelott.xyz/api/v1/quote/all
https://kaamelott.xyz/api/v1/quote/random
https://kaamelott.xyz/api/v1/quote/:id
```

Response example :
```json
{
    "id": 47,
    "content": " Si Monsieur et Madame préfèrent s'envoyer des fions dans l'intimité, je peux aussi me retirer.",
    "actor": "Vanessa Guedj",
    "characts": "Angharad",
    "author": "Alexandre Astier",
    "season": "Livre II ",
    "episode": " 37 : La Joute Ancillaire"
}
```

### API SOUND
  
  End Points :
  ```
  https://kaamelott.xyz/api/v1/sound/all
  https://kaamelott.xyz/api/v1/sound/random
  https://kaamelott.xyz/api/v1/sound/:text
  ```

  Response example :
  ```json
  {
      "name": "le_caca_des_pigeons_c_est_caca_faut_pas_manger.mp3",
      "path": "https://kaamelott.xyz/sounds/le_caca_des_pigeons_c_est_caca_faut_pas_manger.mp3"
  }
  ```