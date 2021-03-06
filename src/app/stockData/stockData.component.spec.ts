import {async, ComponentFixture, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {StockData} from './stockData.component';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import fetchMock from 'fetch-mock';
import {MATCHED} from 'fetch-mock';

describe('StocksData', () => {
  let component: StockData;
  let fixture: ComponentFixture<StockData>;
  let compiled;
  let appInput;
  let submitButton;
  let stockData;
  let noResult;

  const pushValue = async (value) => {
    appInput.value = value;
    appInput.dispatchEvent(new Event('change'));
    appInput.dispatchEvent(new Event('input'));
    submitButton.click();
    await fixture.whenStable();
  };

  const getByTestId = (testId: string) => {
    return compiled.querySelector(`[data-test-id="${testId}"]`);
  };

  afterEach(fetchMock.reset);

  beforeEach(async(() => {
    TestBed
      .configureTestingModule({
        imports: [
          RouterTestingModule,
          FormsModule,
          HttpClientModule
        ],
        declarations: [StockData]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockData);
    fixture.autoDetectChanges(true);
    compiled = fixture.debugElement.nativeElement;
    component = fixture.componentInstance;
    appInput = getByTestId('app-input');
    submitButton = getByTestId('submit-button');
    stockData = getByTestId('stock-data');
    noResult = getByTestId('no-result');
    fixture.detectChanges();
  });

  it(`Initial UI is rendered as expected`, async () => {
    await fixture.whenStable();
    expect(appInput.textContent.trim()).toBe('');
    expect(submitButton.textContent.trim()).toBe('Search');
    expect(stockData).toBeNull();
    expect(noResult).toBeNull();
  });

  it('search is made on by clicking on search button and no results found', async(done) => {
    const url = 'https://jsonmock.hackerrank.com/api/stocks?date=1-January-2020';
    fetchMock.getOnce(url, JSON.stringify({ page:1,per_page:10,total:0,total_pages:0,data:[]}));
    await pushValue('1-January-2020');
    await fixture.whenStable();
    setTimeout(() => {
      fixture.detectChanges();
      fixture.whenRenderingDone();
      const wasFetchCalled = fetchMock.done();
      expect(wasFetchCalled).toBe(false);
      fetchMock.called(url);
      expect(getByTestId('stock-data')).toBeNull();
      expect(getByTestId('no-result')).toBeTruthy();
      expect(getByTestId('no-result').innerHTML).toEqual('No Results Found');
      done();
    }, 500);
  });

  it('search is made on by clicking on search button and result found - test 1', async(done) => {
    const url = 'https://jsonmock.hackerrank.com/api/stocks?date=5-January-2000';
    fetchMock.getOnce(url, JSON.stringify({
      page: 1,
      per_page: 10,
      total: 0,
      total_pages: 0,
      data: [{
          "date": "5-January-2000",
          "open": 5265.09,
          "high": 5464.35,
          "low": 5184.48,
          "close": 5357
      }]
    }));
    await pushValue('5-January-2000');
    await fixture.whenStable();
    setTimeout(() => {
      fixture.detectChanges();
      fixture.whenRenderingDone();
      const wasFetchCalled = fetchMock.done();
      expect(wasFetchCalled).toBe(false);
      fetchMock.called(url);
      const results = getByTestId('stock-data');
      expect(results).toBeTruthy();
      expect(results.childNodes.length).toEqual(4);
      expect(results.childNodes[0].innerHTML).toEqual('Open: 5265.09');
      expect(results.childNodes[1].innerHTML).toEqual('Close: 5357');
      expect(results.childNodes[2].innerHTML).toEqual('High: 5464.35');
      expect(results.childNodes[3].innerHTML).toEqual('Low: 5184.48');
      expect(getByTestId('no-result')).toBeNull();
      done();
    }, 500);
  });

  it('search is made on by clicking on search button and result found - test 2', async(done) => {
    const url = 'https://jsonmock.hackerrank.com/api/stocks?date=5-January-2001';
    fetchMock.getOnce(url, JSON.stringify({
      page: 1,
      per_page: 10,
      total: 0,
      total_pages: 0,
      data: [{
          "date": "5-January-2001",
          "open": 4116.34,
          "high": 4195.01,
          "low": 4115.35,
          "close": 4183.73
      }]
    }));
    await pushValue('5-January-2001');
    await fixture.whenStable();
    setTimeout(() => {
      fixture.detectChanges();
      fixture.whenRenderingDone();
      const wasFetchCalled = fetchMock.done();
      expect(wasFetchCalled).toBe(false);
      fetchMock.called(url);
      const results = getByTestId('stock-data');
      expect(results).toBeTruthy();
      expect(results.childNodes.length).toEqual(4);
      expect(results.childNodes[0].innerHTML).toEqual('Open: 4116.34');
      expect(results.childNodes[1].innerHTML).toEqual('Close: 4183.73');
      expect(results.childNodes[2].innerHTML).toEqual('High: 4195.01');
      expect(results.childNodes[3].innerHTML).toEqual('Low: 4115.35');
      expect(getByTestId('no-result')).toBeNull();
      done();
    }, 500);
  });
});
