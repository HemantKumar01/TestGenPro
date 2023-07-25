$0 = document.querySelector(
  "#parentCtrl > div.maincontainer > div:nth-child(3) > div:nth-child(2) > div.inrmain > div.leftmain > div.quehdng > span.quehdnglft.ng-binding > span"
);
$01 = document.querySelector(
  "#parentCtrl > div.maincontainer > div:nth-child(3) > div:nth-child(2) > div.inrmain > div.leftmain > div.quehdng > span.quehdngryt > span:nth-child(4) > div > span.ng-binding"
);
var intvl = setInterval(() => {
  if (inh == $0.innerHTML) {
    return;
  }
  times = $01.querySelectorAll("strong");
  console.log(
    (parseInt(times[0].innerHTML) + parseInt(times[1].innerHTML) / 60).toFixed(
      2
    )
  );
  inh = $0.innerHTML;
}, 10);
