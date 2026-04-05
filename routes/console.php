<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Mailtrap\Helper\ResponseHelper;
use Mailtrap\MailtrapClient;
use Mailtrap\Mime\MailtrapEmail;
use Symfony\Component\Mime\Address;
Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
Artisan::command('send-mail', function () {
    $email = (new MailtrapEmail())
        ->from(new Address('hello@demomailtrap.co', 'Mailtrap Test'))
        ->to(new Address('phatgia24112006@gmail.com'))
        ->subject('You are awesome!')
        ->category('Integration Test')
        ->text('Congrats for sending test email with Mailtrap!')
    ;

    $response = MailtrapClient::initSendingEmails(
        apiKey: '79d2558094a74ce2c73b1761232f78ba'
    )->send($email);

    var_dump(ResponseHelper::toArray($response));
})->purpose('Send Mail');