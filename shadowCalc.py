from pysolar import solar
import math
import datetime

LAT_LONG_DEG_MAGIC = 111111
EARTH_RADIUS = 6378000 # in meters

# The sun position given the relative time and place on earth
class SunPosition:
    def __init__(self, date, latitude, longitude):
        self.date = date            # the datetime in question
        self.latitude = latitude    # the latitude in degrees of the earth location
        self.longitude = longitude  # the longitude in degrees of the earth location
        
    def altitude(self):
        if hasattr(self, "_altitude"):
            return self._altitude
        self._altitude = solar.get_altitude(self.latitude, self.longitude, self.date)
        return self._altitude

    def azimuth(self):
        if hasattr(self, "_azimuth"):
            return self._azimuth
        self._azimuth = solar.get_azimuth(self.latitude, self.longitude, self.date)
        return self._azimuth

class Building:
    def __init__(self, height, polygon, sunPosition):
        self.height = height # height in meters
        self.polygon = polygon # a polygon, type list {the vertices of the building}
        self.sunPosition = sunPosition # sun position relative to the building

    def getShadow(self):
        if hasattr(self, "_shadow"):
            return self._shadow
        L = self.calcShadowLength()
        alpha = self.sunPosition.azimuth()
        X_dif = (L * math.sin(alpha)) # X difference in meters
        Y_dif = (L * math.cos(alpha)) # Y difference in meters
        self._shadow = []
        for v in self.polygon:
            latitude = v[0]
            longitude = v[1]
            new_latitude = latitude + ((Y_dif / EARTH_RADIUS) * (180/math.pi))
            new_longitude = longitude + ((X_dif / EARTH_RADIUS) * (180/math.pi) / math.cos(latitude * math.pi / 180))
            self._shadow.append([new_latitude, new_longitude])
        return self._shadow 

    def calcShadowLength(self):
        sunAltitude = self.sunPosition.altitude()
        self._shadowLength = self.height/math.tan(sunAltitude)
        return self.height/math.tan(sunAltitude)

def testData():
    header = ''
    testLine = ''
    with open("Volumes-batis/volumesbatisparis.csv") as fp:
        for i, line in enumerate(fp):
            if i == 0:
                header = line
            elif i == 1:
                testLine = line
                break

def testSunPosition():
    datet = datetime.datetime(2007, 2, 18, 15, 13, 1, 130320, tzinfo=datetime.timezone.utc)
    sun = SunPosition(datet, 42.206,-71.382)
    assert round(sun.altitude(), 5) == 30.91447
    assert round(sun.azimuth(), 5) == 149.24819

# Shadow polygon needs updating (currently incomplete)
def testBuildingShadow():
    datet = datetime.datetime(2019, 7, 30, 15, 45, 14, 793927, tzinfo=datetime.timezone.utc)
    sun = SunPosition(datet, 48.85954289527409,2.26666688114774)
    building_polygon = [[2.321230990799024, 48.883737843553725], [2.32126610290205, 48.883662546380585], [2.3212254819384, 48.88365402425022], [2.321189986547851, 48.883646577089586], [2.321174554127694, 48.883643339231504], [2.321135396461886, 48.88363512484447], [2.321108242056935, 48.88369245887957], [2.3211004388451553, 48.883709751057076], [2.321230990799024, 48.883737843553725]]
    building_height = 10
    bati = Building(building_height, [[b[1],b[0]]for b in building_polygon], sun)
    print(bati.getShadow())

def main():
    testData()
    testSunPosition()
    testBuildingShadow()

if __name__=="__main__":
    main()