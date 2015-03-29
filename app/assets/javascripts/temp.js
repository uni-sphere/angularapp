var removeUnwantedAttribute = function(key, value){
  if(key == 'parent' || key == 'reqParams' || key == 'fromServer' || key == 'parentResource' || key == 'restangularCollection' || key == 'route' || key == 'restangularEtag' || key == 'id' || key == 'depth' || key == 'x' || key == 'y' || key == 'x0' || key == 'y0'){
    return;
  } else{
    return value;
  }
};

var plop = function(key, value){
  if(key == 'parent' || key == 'id' || key == 'depth' || key == 'x' || key == 'y' || key == 'x0' || key == 'y0'){
    return;
  } else{
    return value;
  }
};