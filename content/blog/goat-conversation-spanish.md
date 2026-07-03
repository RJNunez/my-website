---
title: "A Data Approach to the G.O.A.T Conversation (Spanish Version)"
date: 2019-06-25
summary: "Versión en español: una comparación entre Kobe Bryant, Michael Jordan y LeBron James a través de puntos, asistencias y eficiencia de tiro para decidir quién es el G.O.A.T."
canonical: "https://medium.com/@rolando.j123/a-data-approach-to-the-g-o-a-t-conversation-spanish-version-b49b0cc36f8d"
tags: ["data science", "sports", "español"]
---

## Una comparación entre K. Bryant, M. Jordan y L. James

### El Mejor de Todos los Tiempos (G.O.A.T por sus siglas en inglés)

Desde que Lebron James no entró a la post-temporada de la NBA en 2018–19, ha habido mucho debate entre personas que son prisioneros del momento sobre quién es el mejor jugador del mundo actualmente. Algunos jugadores mencionados en esta conversación son Kawhi Leonard, Giannis Antetokounmpo y Kevin Durant. Sin duda alguna estos tres están entre los mejores jugadores en la liga, pero no le llegan a los tobillos al Rey de la NBA — en mi humilde opinión. Todavía no. Estas comparaciones revitalizaron las conversaciones sobre el mejor jugador de todos los tiempos (G.O.A.T., por sus siglas en inglés). El jugador que posee el distinguido título depende a quién se le pregunta. Parece haber un efecto generacional a la hora de decidir a quién otorgar el premio — aunque tal premio no exista. El tema se discute mayormente en conversaciones entre amigos en barberías, entre amigos. Muchos piensan que Michael Jordan es el G.O.A.T., otros mencionan a Kobe Bryant o a Lebron James. Algunos incluso mencionan a Kareem Abdul-Jabbar o a Oscar Robertson (¡Big O!).

Para mantener esta entrada simple, solamente consideré los datos de James, Bryant y Jordan. Los datos originales se pueden descargar de la página de internet [Basketball-Reference](https://www.basketball-reference.com) que contiene todo tipo de datos sobre jugadores de la NBA que a uno le pueda interesar. Los datos de Lebron James no están completos dado a cuando descargué los datos (algunos meses atrás cuando primero tuve la idea de hacer esto). El último día con datos para este jugador es febrero 21 de 2019. Por ende, la última parte de la temporada 2018–19 no está disponible (aunque se puede descargar de Basketball-Reference). Los datos de Bryant y Jordan están completos.

### The Jumpman, The Black Mamba, and The King

Mencionar y describir los premios acumulados por estos tres jugadores tomaría demasiado tiempo. Así que me enfocaré solamente en campeonatos, premios de jugador más valioso (MVP por sus siglas en inglés) en la final y premios de MVP en la temporada regular.

Michael Jordan es considerado por muchos como el mejor jugador en la historia del deporte. Esto tal vez se debe a que Jordan nunca perdió una final. ¡Ganó todas las finales en las que jugó! Seleccionado en el 1984 por los Bulls de Chicago, Jordan rápidamente se convirtió en uno de los mejores jugadores de su era. Tanto así que el gran Larry Bird en el 1986 dijo de Jordan: "Creo que es Dios disfrazado de Michael Jordan".

Como James, Jordan ganó el premio de novato del año (ROY por sus siglas en inglés) en el 1984. A través de su carrera ganó el campeonato tres veces consecutivas en dos ocasiones distintas. El primer three-peat (tres campeonatos consecutivos) fue del 1991 al 1993 y el segundo fue de 1996 al 1998. Fue el MVP de los seis campeonatos. Por último, Jordan ganó el MVP de la temporada regular en 1988, 1991, 1992, 1996, y 1998.

The Black Mamba (el apodo de Kobe Bryant) fue seleccionado por los Hornets de Charlotte en el 1996. Fue cambiado a Los Angeles Lakers poco después y fue allí donde jugó toda su carrera. Veinte años en total. Kobe ganó tres campeonatos consecutivos, de 2000 al 2002, y luego dos campeonatos más en 2009 y 2010 para un total de 5 campeonatos. Sin embargo, solo ganó el premio de MVP en los últimos dos. Los primeros tres premios de MVP fueron para su compañero Shaquille O'neal. Con respecto a la temporada regular, Bryant solo ganó un MVP en el 2008. Entre sus mejores hazañas está el haber anotado 60 puntos en su último juego. Un gran final para una carrera increíble.

Lebron James llegó a la liga en el 2003 cuando fue seleccionado por los Cavaliers de Cleveland. En ese mismo año ganó el premio de novato del año. El Rey (como se le conoce) ha ganado tres campeonatos, los primeros dos en 2012 y 2013 con los Heat de Miami y el último con los Cavaliers de Cleveland en el 2016 (el primer campeonato en la historia de la franquicia). James ganó el MVP en las tres finales. El último campeonato fue en contra del mejor equipo en la historia de la temporada regular. Finalmente, James ha ganado el MVP de la temporada regular en 2009, 2010, 2012 y 2013. Sin embargo, algunos (si no todos) argumentan que él ha sido el mejor jugador de la liga durante toda su estadía en la liga y que debe tener más premios de MVP.

Dentro de las cosas no mencionadas arriba están las medallas olímpicas, títulos de puntuación, entre otras cosas que como mencioné arriba, tomaría mucho tiempo para describir. Ahora veamos lo que dicen los datos sobre la grandeza de estos jugadores y así concluir quién es el G.O.A.T.

### El Anotador y el Facilitador

Hay muchas cosas en las que se puede comparar a estos jugadores. Yo me concentraré solo en algunas estadísticas que van desde puntos por juego (PPG) a minutos por juego (MPPG). Al final exploraré los puntos, asistencias y minutos acumulados durante sus carreras. Además, presentaré un modelo lineal simple para predecir cuándo Lebron James sobrepasará a Kareem Abdul-Jabbar en puntos (Jabbar es el líder en puntos en la historia de la NBA). Empecemos con PPG. En la temporada regular Jordan tiene un PPG más alto que James en todas sus temporadas excepto la 2da, 14ta y 15ta temporada. Sin embargo, el PPG de Jordan, en general, disminuye con los años, mientras que el PPG de James se mantiene más o menos constante — alrededor de 27 puntos por juego. En retrospectiva, los puntos por juego en los primeros años de carrera de Bryant son por debajo de lo que se esperaría. Pienso que esto habla sobre su ética de trabajo. Sus PPG culminaron en su 10mo año con un poco más de 35 puntos por juego. La historia es similar en la post-temporada. De esto diría que Jordan gana el debate de puntos por juego.

Otra estadística muy importante es el número promedio de asistencias por juego (APG). Un jugador obtiene una asistencia cuando pasa la bola a un compañero de forma tal que se anoten puntos. Así que un jugador con número alto de asistencias implica que está ayudando a sus compañeros a ser mejores jugadores. Es claro (viendo los datos) que Lebron James es generalmente un mejor facilitador que los otros dos jugadores.

### Eficiencia — Promedios de Tiro

Por brevedad y simplicidad presentaré y resumiré tres estadísticas en esta sección. Primero, lo que se conoce en inglés como *Field Goal (FG) percentage*, y que yo traduzco como el porcentaje de tiro. FG se define como el número de tiros encestados sobre el número de tiros intentados multiplicado por 100. Un FG alto implica que el jugador es muy eficiente. De forma similar, el *Free Throw (FT) percentage* o el porcentaje de tiros libres se define como el número de tiros libres encestados sobre el número de tiros libres intentados multiplicado por 100. Por último, el *Three Point (TP) percentage* o el porcentaje de tiros de tres es lo mismo que el FG pero solo considerando tiros de tres puntos.

Resulta que en la primera mitad de sus respectivas carreras los tres jugadores eran más o menos comparables con respecto a su porciento de FG. Más sin embargo noten que desde el 10mo año la eficiencia de James mayormente rondea la marca de 55%. En términos simples esto significa que de cada 100 tiros intentados, en promedio, encesta 55 tiros. Por ende, aquí gana el Rey.

Con respecto al porcentaje de FT, Kobe Bryant y Michael Jordan son indiscutiblemente mejores que Lebron James. Creo que esta es la única crítica legítima contra Lebron. Para un jugador tan trascendental, el porcentaje de FT de James no es bueno. No obstante, es excelente en todo lo demás. Diría que el Black Mamba tiene una leve ventaja durante la temporada regular, pero Jordan tiene la ventaja en la post-temporada.

El porcentaje de TP es el tiro más difícil en el deporte ya que la línea de tres puntos está a unos 23 pies del canasto. En la temporada regular y en la post-temporada, el porcentaje de TP de los jugadores es similar. En este argumento, ninguno de los tres jugadores tiene ventaja.

### Estadísticas Acumulativas

En esta última sección hablaré de asistencias, minutos y puntos acumulados en las carreras de cada jugador. Además, voy a usar un modelo lineal simple para predecir cuándo Lebron James puede romper el record de más puntos en la historia de la NBA. La trayectoria de minutos acumulados de los jugadores es muy parecida. Michael Jordan y Kobe Bryant ya se retiraron, así que no pueden añadir minutos a sus carreras. Bryant jugó un total de 7,115 minutos más que Jordan. Actualmente (al menos hasta el momento en que descargué los datos), James ha jugado un total de 45,201 minutos.

Pasemos al número acumulado de asistencias. No hay duda alguna que Lebron James es un mejor facilitador que ambos Jordan y Kobe, como muestran los datos. Actualmente, James tiene 8,512 asistencias acumuladas (ese número es más alto ahora). Por otro lado, Jordan y Kobe tienen 5,633 y 6,306, respectivamente. No olviden que Lebron aún está jugando, así que la diferencia crecerá.

Por último, aquí muestro los puntos acumulados por los tres jugadores. Jordan le tomó menos tiempo para llegar a la codiciada y casi inhumana marca de encestar 30,000 puntos. Sin embargo, Lebron James es el jugador más joven en la historia en encestar 30,000 puntos. Michael Jordan tiene 32,292 puntos acumulados, Kobe Bryant tiene 33,643, y Lebron James actualmente tiene 32,111 (ese número es más alto ahora).

Kareem Abdul-Jabbar es el jugador con más puntos en la historia con 38,387. Usando un modelo lineal en donde la variable dependiente es los puntos acumulados y la variable independiente es el número de juegos jugados, estimo que Lebron James romperá el record de puntos en su juego 1,400. Esto es, predigo que en alrededor de tres temporadas regulares más (217 juegos más para ser exacto) Lebron James se convertirá en el máximo anotador de puntos en la historia del juego.

Resumiendo todo el material, si por mí fuera le daría el título de G.O.A.T a Lebron James. La consistencia que ha demostrado en todos los aspectos del juego es incomparable. Cuando acabe su carrera probablemente tenga más de 10,000 asistencias acumuladas y termine como el máximo anotador de puntos en la historia de la liga. Michael Jordan queda en segundo y Kobe Bryant está muy cerca, en tercer lugar. Debo confesar que soy fan de Kobe Bryant, pero los datos no mienten: no es mejor que Jordan, y Jordan no es mejor que James.
