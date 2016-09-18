<?php
    $mailFrom = $_POST['mail'];
    $mailFromName = 'Contact - Enfants du web';
    $mailSubject = 'Proposition - Enfants du web';
    $mailMessage = stripslashes($_POST['body']);

    $sujet = $mailSubject;
    $strTo = 'contact@synerghetic.net';
    $strHeader  = 'MIME-Version: 1.0' . "\r\n";
    $strHeader .= 'Content-type: text/html; charset=UTF-8' . "\r\n";
    $strHeader .= "From: ".$mailFromName." <".$mailFrom.">" . "\r\n";
    $strHeaders .= "Reply-To: ".$mailFrom."\r\n"."X-Mailer: PHP/".phpversion();
    $message = "
        <html>
            <head>
                <meta charset='utf-8'>
                <title>
                    Proposition de projet
                </title>
            </head>
            <body>
                <h2>
                    Proposition de projet
                </h2>

                <b>Mail de l'emetteur</b> : ".$_POST['mail']."
                <br>
                <br>
                <b>Message :</b>
                <br>
                ".$mailMessage."
            </body>
        </html>
    ";

    if (mail($strTo,$sujet,$message,$strHeader)) {
        $data = array('success' => true, 'message' => 'Merci ! Votre mail a bien été envoyé !', 'mail' => $message);
        echo json_encode($data);
    } else {
        $data = array('success' => false, 'message' => 'Une erreur est survenue, le mail n\'a pas pu être envoyé');
        echo json_encode($data);
        exit;
    }
?>
