//設定画面で保存ボタンを押されたら
function save_options() {

  //設定値を変数に格納
  var strength = document.getElementById('strength').value;
  
  //ストレージに保存
  chrome.storage.sync.set({
    selectStrength: strength,
    
  }, function() {
    // 保存が完了すると、画面にメッセージを表示(0.75秒)
    var status = document.getElementById('status');
    status.textContent = '保存しました';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

//設定画面で設定を表示する
function restore_options() {
  //デフォルト値を設定する
  chrome.storage.sync.get({
    selectStrength: 'normal'
  
  //保存された場合は、その値を使う
  }, function(items) {
    document.getElementById('strength').value = items.selectStrength;
  });
}

//画面表示と保存ボタンのイベントを設定
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);