import { Component } from '@angular/core';
// import { Spinkit } from 'ng-http-loader/spinkits';
import { SpinnerComponent } from './base/components/spinner/spinner.component';
import * as AOS from 'aos';
import { AuthService } from './services/auth.service';
import { Router, ActivatedRoute, Params, ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';
import * as $ from 'jquery';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
@Component({
  selector: 'body',
  templateUrl: './app.component.html'
})
export class AppComponent {
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  constructor(private authS: AuthService, private router: Router, private idle: Idle, private keepalive: Keepalive) {
    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(5);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(3600);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    idle.onTimeout.subscribe(() => {


      this.authS.logout(JSON.parse(localStorage.getItem('currentUser')).user.loginid, true).subscribe(
        res => {
          localStorage.clear();
          this.router.navigateByUrl(`/`);
          this.idleState = 'Timed out!';
          this.timedOut = false;
        },
        err => {

        }

      )

      // clear token remove user from local storage to log user out
      // this.token = null;




    });
    idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');

    // sets the ping interval to 15 seconds
    keepalive.interval(20);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.reset();
  }
  public sp = SpinnerComponent;
  ngOnInit() {
    // var r = confirm("Please select OK to get portal updates");
    // if (r == true) {
    //   location.reload(true);
    // }
    this.chatbot();
    //to handle disappearence of theme on reload we check and update theme on app component
    this.authS.setUserTheme();

    AOS.init(); //Homepage animation initialization
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  onRowAdded() {
    // $('.chatbox-panel__main,.chatbox-popup__main').animate({
    //   scrollTop: $('.chatbox-panel__main,.chatbox-popup__main').prop('scrollHeight')
    // });

    $('.chatbox-panel__main,.chatbox-popup__main').each(function () {
      $(this).animate({
        scrollTop: $(this).prop('scrollHeight')
      });
    })


  };

  postMessage(message: HTMLInputElement) {
    // console.log(message.value);
    this.onRowAdded();


    $('.chat-intro').remove();

    $(".chat-message-list").append("<li class='message-right'><div class='messageinner'><span class='message-text'>" + message.value + "</span></div></li>");
    $(".chat-message-list").append('<li class="message-left sp" style="display: list-item;"><div class="sp-ms2"><span class="spinme-left"><div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div></span></div></li>');


    //response from chatbot from backend

    this.authS.chatBot(message.value).subscribe(results => {
      message.value = '';
      $('.sp').remove();
      $(".chat-message-list").append("<li class='message-left'><div class='messageinner'><span class='message-text'>" + results + "</span></div></li>");
    }, err => {
      $('.sp').remove();
      $(".chat-message-list").append("<li class='message-left'><div class='messageinner'><span class='message-text'>There was some technical error. Please try after some time.</span></div></li>");
    });

    // setTimeout(function(){
    // 	$('.sp').remove();
    // $(".chat-message-list").append("<li class='message-left'><div class='messageinner'><span class='message-text'>hythtyh</span></div></li>");
    // },2000)


  }
  chatbot() {
    const chatbox = jQuery.noConflict();


    chatbox(() => {
      chatbox(".chatbox-open").click(() =>
        chatbox(".chatbox-popup, .chatbox-close").fadeIn()
      );

      chatbox(".chatbox-close").click(() =>
        chatbox(".chatbox-popup, .chatbox-close").fadeOut()
      );

      chatbox(".chatbox-maximize").click(() => {
        chatbox(".chatbox-popup, .chatbox-open, .chatbox-close").fadeOut();
        chatbox(".chatbox-panel").fadeIn();
        chatbox(".chatbox-panel").css({ display: "flex" });
      });

      chatbox(".chatbox-minimize").click(() => {
        chatbox(".chatbox-panel").fadeOut();
        chatbox(".chatbox-popup, .chatbox-open, .chatbox-close").fadeIn();
      });

      chatbox(".chatbox-panel-close").click(() => {
        chatbox(".chatbox-panel").fadeOut();
        chatbox(".chatbox-open").fadeIn();
      });
    });

  }


  // selectIPADB(id){
  //   console.log(this.router.url);
  //   const url = this.router.url
  // this.router.navigateByUrl(`/`).then(
  //     () => {
  //       this.router.navigateByUrl(url);
  //     });
  //   this.authS.selectIPADB(id).subscribe(

  //       res => {

  //         // this.router.navigate(['/dashboard']);

  //       },
  //       err => {
  //         // localStorage.clear();
  //         // this.router.navigate(['/']);
  //         // this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  //       }
  //     )
  // }

}
