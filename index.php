<?php
session_start();
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <title>
        SchullBuss - Connexion
    </title>
</head>

<body class="bg-dark text-light">
    <header>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <a class="navbar-brand text-info" href="/">SchullBuss</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon text-light"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        
                    </ul>
                    <form class="d-flex">
                        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                        <button class="btn btn-outline-success" type="submit">Search</button>
                    </form>
                </div>
            </div>
        </nav>

    </header>
    <div class="p-5" id="main-page">
        <div class="d-flex justify-content-center align-items-center vh-100" id="main-content">
            <form action="#" id="myFormLogin">
                <div class="d-flex flex-column justify-content-center align-items-center gap-1 p-1">
                    <div class="d-flex flex-column">
                        <input type="email" name="email" id="email" placeholder="Email" required>
                    </div>
                    <div class="d-flex flex-column">
                        <input type="password" name="password" id="password" placeholder="password" required>
                    </div>

                    <input type="submit" value="Se connecter">
                    <div id="notification" class="alert"></div>
                </div>
            </form>

        </div>
    </div>
    <footer>
        <script src="/bundle.js"></script>
    </footer>
</body>

</html>