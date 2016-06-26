<?php
    $mailFrom = $_POST['mail'];
    $mailFromName = 'Contact - Enfants du web';
    $mailSubject = 'Proposition de projet';
    $mailAnswers = $_POST['answers']
    $mailMessage = stripslashes($_POST['body']);

    $sujet = $mailSubject;
    $strTo = 'kleman.theo@gmail.com';
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
                <b>Message :</b> 
                <br>
                ".$mailMessage."
                ".var_dump($mailAnswers)."
            </body>
        </html>
    ";

    if (mail($strTo,$sujet,$message,$strHeader)) {
        $data = array('success' => true, 'message' => 'Merci ! Votre mail a bien été envoyé !');
        echo json_encode($data);
    } else {
        $data = array('success' => false, 'message' => 'Une erreur est survenue, le mail n\'a pas pu être envoyé');
        echo json_encode($data);
        exit;   
    }
?>
