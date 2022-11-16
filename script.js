//const countyURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
const countyURL = "https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json"

//const countyURL ="https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json"
//const vaccineURL = "https://data.cdc.gov/resource/8xkx-amqh.json"
const vaccineURL = "https://data.cdc.gov/resource/7pvw-pdbr.json"

const canvas = d3.select('#canvas')

function drawMap(countyData, vaxData) {
    canvas.selectAll('path')
        .data(countyData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath())
        .attr('class', 'county')
        .attr('fill',(countyDataItem) => {
            const {id} = countyDataItem;
            // reverse this so we're finding the county instead of vax??
            const county = vaxData.find((item) => {
                return item.fips === id 
            })
            
            if(!county) {
                return 'blue';
            }
            let percentage = county['booster_doses']
            if(percentage <= 10) {
                return 'tomato'
            }else if(percentage <= 15){
                return 'orange'

            }else if(percentage <= 30){
                return 'lightgreen'
            }else{
                return 'limegreen'
            }
        })
}

d3.json(countyURL).then(
    (data, error) => {
        if(error) {
            console.log(error)
            return;
        }
        countyData = topojson.feature(data, data.objects.counties).features
        console.log(countyData[0].id)

        d3.json(vaccineURL).then(
            (vaccineData, error) => {
                if(error){
                    console.log(error)
                    return;
                }
                const pairedVaxData = vaccineData.filter(item => Boolean(item.booster_doses));
                const countyDataWithFips = countyData.filter(item => {
                    vaccineData.find(vaxData => vaxData.fips === item.id)
                });
                console.log("FIPSMatch", countyDataWithFips);
                // let county = vaxData.find((item) => {
                //     return item['fips'] === id 
                // })
                // console.log(vaccineData)
                drawMap(countyData, pairedVaxData);    
            }
        )
    }
)            
        
    
