Meteor.naturalSort = function(firstItem, secondItem) {
  var firstItemMatch, secondItemMatch, a1, b1, i= 0, n, firstItemLength,
  pattern=/(\.\d+)|(\d+(\.\d+)?)|([^\d.]+)|(\.\D+)|(\.$)/g;

  if(firstItem === secondItem) return 0;
  firstItemMatch  = firstItem.toLowerCase().match(pattern);
  secondItemMatch = secondItem.toLowerCase().match(pattern);
  firstItemLength = firstItemMatch.length;


  while(i< firstItemLength){
      if(!secondItemMatch[i]) {
        return 1;
      }
      a1 = firstItemMatch[i],
      b1 = secondItemMatch[i++];
      if(a1 !== b1) {
          n = a1-b1;
          if(!isNaN(n)) {
            return n;
          }
          return a1 > b1 ? 1 : -1;
      }
  }

  return secondItemMatch[i] ? -1 : 0;
}
