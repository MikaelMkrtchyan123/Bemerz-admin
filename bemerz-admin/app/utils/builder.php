<?php
require_once "ClosureCompiler.php";

class JsBuilder{

  private $bemerzEnv = "dev";
  private $bemerzVersion = "0.0.";
  private $scriptsJsonArr = [];
  private $documentRoot = [];
  private $HTTP_HOST = [];

  public function __construct() {
    if (getenv('BEMERZ_ENV') == "production"){
      $this->bemerzEnv = "prod";
    }
    $this->documentRoot = realpath(__DIR__."/..");
    $this->HTTP_HOST = "//".$_SERVER["HTTP_HOST"];
    if(strpos($_SERVER["REQUEST_URI"], "app") !== false){
      $this->HTTP_HOST .= "/app";
    }
    $configFile = json_decode(file_get_contents("../js/builder.json"), true);
    $this->bemerzVersion = $configFile["versions"][$this->bemerzEnv];
    $this->scriptsJsonArr = $configFile["files"];
    if($this->bemerzEnv == "dev"){
      $this->doDevOutput($this->scriptsJsonArr);
      return;
    }
    $this->doProdOutput($this->scriptsJsonArr);
  }

  protected function doProdOutput($files) {
    $buf = "";
    $outFile = $this->documentRoot."/js/out.js";
    $pattern = '/(?:(?:\/\*(?:[^*]|(?:\*+[^*\/]))*\*+\/)|(?:(?<!\:|\\\|\')\/\/.*))/';
    foreach ($files as $value){
      $inputFile = $this->documentRoot."/js/" . trim($value);
      if(file_exists($inputFile)){
        $output = file_get_contents($inputFile);
        if(strpos($inputFile, "lib/") == false){
          $output = preg_replace($pattern, '', $output);
        }
      }
      $buf .=  $output;
    }
    header("Content-type: ".$this->getContentType());
   // $compressedBuf = $this->doCompress($buf);
    $compressedBuf = $buf;
    file_put_contents($outFile, $compressedBuf);
    echo $compressedBuf;exit;
  }

  protected function doCompress($buf) {
    return ClosureCompiler::minify($buf);
  }

  protected function doDevOutput($files) {
    header("Content-type: ".$this->getContentType());
    foreach ($files as $value){
      $inputFile =  $this->HTTP_HOST."/js/" . trim($value)."?version=".$this->bemerzVersion;
      echo("document.write('<script type=\"text/javascript\" src=\"" . $inputFile . "\"></script>');\n\r");
    }
  }

  protected function getItemDir($module) {
    return NGS()->getJsDir($module);
  }


  protected function getContentType() {
    return "text/javascript";
  }

}

new JsBuilder();