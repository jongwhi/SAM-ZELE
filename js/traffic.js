var API_DOMAIN = 'http://openapi.its.go.kr';
var key = '1523844711801';
var NOPOP_LAYERS = [];

window.onload = init;
var map;

function init() {
    // 지도 생성
    map = new OpenLayers.Map({
        div: "map",
        projection: new OpenLayers.Projection('EPSG:900913'),
        displayProjection: new OpenLayers.Projection('EPSG:4326'),
        units: "m",
        maxExtent: new OpenLayers.Bounds(13489539, 3828608, 14943678, 4881604),
        restrictedExtent: new OpenLayers.Bounds(13489539, 3828608, 14943678, 4881604),
        layers: [
				new OpenLayers.Layer.Vworld_Base('Vworld', {
                numZoomLevels: 17,
                transitionEffect: ''
            })
			],
        controls: [
				new OpenLayers.Control.Navigation()
				, new OpenLayers.Control.MousePosition()
				, new OpenLayers.Control.ScaleLine()
				, new OpenLayers.Control.PanZoomBar({
                zoomWorldIcon: true
            })
				, new OpenLayers.Control.LayerSwitcher()
				, new OpenLayers.Control.OverviewMap({
                layers: [new OpenLayers.Layer.OSM()],
                mapOptions: {
                    projection: 'EPSG:900913'
                },
                autoPan: true,
                maximized: true
            })
			]
    });
    // 지도 초기 위치 설정
    map.setCenter(new OpenLayers.LonLat(14142832, 4514272), 12); //좌우-,상+하
    // 교통정보 시작
    var ntic = new Ntic('nticLayer');
    NOPOP_LAYERS.push(ntic.getLayer());
    // 교통정보 종료
    map.addLayers(NOPOP_LAYERS);
}